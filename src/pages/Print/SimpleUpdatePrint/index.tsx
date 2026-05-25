import CustomCheckbox from '@components/CustomCheckbox';
import CustomSelect from '@components/CustomSelect';
import FormGroup from '@components/FormGroup';
import SystemModal from '@components/SystemModal';
import AccountImp from '@interfaces/AccountImp';
import PrintConfigImp from '@interfaces/PrintConfigImp';
import ExpenseImp from '@interfaces/calculations/ExpenseImp';
import FeeImp from '@interfaces/calculations/FeeImp';
import MonetaryFine523Imp from '@interfaces/calculations/MonetaryFine523Imp';
import SimpleAuthorImp from '@interfaces/calculations/SimpleAuthorImp';
import { ApplicationState } from '@store/index';
import React, { useEffect, useRef, useState } from 'react';
import { AiFillDelete, AiFillFileAdd } from 'react-icons/ai';
import { MdFormatAlignCenter, MdFormatAlignLeft, MdFormatAlignRight } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import DropImage from '@/images/drop-image.png';
import IDummyObject from '@interfaces/IDummyObject';
import NomenclatureImp from '@interfaces/NomenclatureImp';
import { AWSS3 } from '@services/S3';
import { decode } from 'base64-arraybuffer';
import * as msgpack from 'msgpack-lite';
import PrintConfigTransformer from '@/transforms/PrintConfigTransformer';
import simpleUpdateSchema from '@/validators/calculations/simpleUpdate/simpleUpdateSchema';
import upload_worker_script from '@/workersweb/upload';
import SimpleUpdatePrint from '@/services/PrintServices/SimpleUpdate';
import { accountTypeEnum } from '@/enums/accountTypeEnum';
import { alertMessages } from '@/hooks/alertMessages';
import { fileNamesSimpleUpdateEnum } from '@/enums/fileNamesEnum';
import { useLoading } from '@/hooks/loading';
import { useUser } from '@/hooks/user';
import { getFieldName } from '@/lib/nomenclature';
import { labelsEnum } from '@/enums/labelsEnum';
import { useNomenclatures } from '@/hooks/nomenclatures';

const formatOptions = [
  {
    id: 1,
    label: 'PDF',
    value: 'PDF',
  },
];

const contentOptions = [
  {
    id: 0,
    label: 'Toda a conta',
    value: 0,
  },
  {
    id: 1,
    label: 'Toda a conta desconsiderando Parcelas e Pagamentos',
    value: 1,
  },
  {
    id: 2,
    label: 'Somente Honorarios',
    value: 2,
  },
  {
    id: 3,
    label: 'Somente Despesas',
    value: 3,
  },
];

const printLegibilityOptions = [
  {
    id: 1,
    label: 'Normal',
    value: 'normal',
  },
  {
    id: 2,
    label: 'Destacada',
    value: 'highlighted',
  },
];

const initialImageStates = {
  imageToUpload: null,
  currentImage: '',
};

interface PropsImp {
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  account?: AccountImp | null;
  authors?: SimpleAuthorImp[];
  art523?: MonetaryFine523Imp;
  expenses?: ExpenseImp[];
  fees?: FeeImp[];
  feesTotal?: number;
  total?: number;
  hasPermissionToSave?: boolean;
}

const Print = ({ hasPermissionToSave = true }: PropsImp): JSX.Element => {
  const dispatch = useDispatch();
  const alertMessage = alertMessages();

  const { closeLoading, openLoading } = useLoading();

  const S3 = new AWSS3();
  const printServices = new SimpleUpdatePrint();

  // const [dataIndicator, setDataIndicator] = useState<IndicatorResponseImp[]>([]);
  const [format, setFormat] = useState('PDF');
  const [content, setContent] = useState('0');
  const [printLegibilityOption, setPrintLegibilityOption] = useState('Normal');

  const [imageAlign, setImageAlign] = useState('left');

  const [header1, setHeader1] = useState('');
  const [header2, setHeader2] = useState('');
  const [header3, setHeader3] = useState('');
  const [header4, setHeader4] = useState('');

  const [signature, setSignature] = useState(false);

  const [signature1, setSignature1] = useState('');
  const [signature2, setSignature2] = useState('');
  const [signature3, setSignature3] = useState('');

  const [accountName, setAccountName] = useState(true);
  const [numberOfPage, setNumberOfPage] = useState(true);
  const [calculationMemory, setCalculationMemory] = useState(true);
  const [observations, setObservations] = useState(true);
  const [titleDescription, setTitleDescription] = useState(true);
  const [judgeCheck, setJudgeCheck] = useState(false);
  const [installments, setInstallments] = useState(true);
  const [centimeters, setCentimeters] = useState(0);
  const [imageKey, setImageKey] = useState('');
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>();
  const [removeImageModal, setRemoveImageModal] = useState<boolean>(false);
  const {
    user: { id: userId },
  } = useUser();
  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const simpleState = useSelector((state: ApplicationState) => state.simple);

  const imageInput: any = useRef(null);
  const { nomenclatures } = useNomenclatures();

  const addImage = (event: React.MouseEvent) => {
    event.preventDefault();
    imageInput?.current?.click();
  };

  // const fetchIndicators = async () => {
  //   const { indexId } = simpleState.account;
  //   try {
  //     openLoading();
  //     if (indexId) {
  //       const data = await new IndicatorService().fetchIndicators(
  //         [`${indexId}`],
  //         moment('01/01/1964', dateFormatEnum.DEFAULT).toDate(),
  //         new Date()
  //       );

  //       const _indicadorDado = data[indexId];
  //       setDataIndicator(_indicadorDado);
  //     }
  //   } catch (error) {
  //     closeLoading();
  //   } finally {
  //     closeLoading();
  //   }
  // };

  const onPrint = (config: PrintConfigImp) => {
    async function encodeToBlobText(input: IDummyObject) {
      // Compacta o objeto usando msgpack
      const inputBytes = msgpack.encode(input);
      const blob = new Blob([inputBytes.buffer] as any, { type: 'application/octet-stream' });

      return blob;
    }
    const upload_worker = new Worker(upload_worker_script);
    openLoading();
    upload_worker.postMessage({ type: 'upload' });
    upload_worker.addEventListener('message', async function (event) {
      try {
        console.info('on_print');
        const message = event.data;
        const payload = {
          ...simpleState,
          account: { ...simpleState.account, indexId: simpleState.indexId },
        };

        const values = await simpleUpdateSchema.validate(payload);
        console.info('on_print_validated');

        const { configuration } = PrintConfigTransformer.output(config);
        const accountData = {
          ...simpleState.account,
          indexId: `${simpleState.account.indexId}`,
        };

        delete accountData?.data;

        const json = {
          configuration: { ...configuration, costCenterId: simpleState.account.costCenterId },
          infos: {
            account: values.account,
            currency: values.currency,
            feesTotal: values.feesTotal,
            expensesTotal: values.expensesTotal,
            paymentsTotal: values.paymentsTotal,
            installmentsTotal: values.installmentsTotal,
            installmentsFinesTotal: values.installmentsFinesTotal,
            installmentsInterestTotal: values.installmentsInterestTotal,
            calculationMemories: simpleState.calculationMemories,
            total: values.total,
            art523: values.isCheckedArt523 && values.art523 ? values.art523 : undefined,
            nomenclatures,
          },
        };

        switch (message.type) {
          case 'uploaded':
            try {
              const [feesBlob, infosBlob, authorBlob, expensesBlob, configurationBlob] = await Promise.all([
                encodeToBlobText(values.fees),
                encodeToBlobText(json.infos),
                encodeToBlobText(values.authors),
                encodeToBlobText(values.expenses),
                encodeToBlobText(json.configuration),
              ]);

              await Promise.all([
                printServices.uploadJSON(
                  feesBlob,
                  fileNamesSimpleUpdateEnum.FEE_ID,
                  simpleState.account,
                  accountTypeEnum.SIMPLE_UPDATE,
                  userId
                ),
                printServices.uploadJSON(
                  infosBlob,
                  fileNamesSimpleUpdateEnum.INFOS_ID,
                  simpleState.account,
                  accountTypeEnum.SIMPLE_UPDATE,
                  userId
                ),
                printServices.uploadJSON(
                  authorBlob,
                  fileNamesSimpleUpdateEnum.AUTHOR_ID,
                  simpleState.account,
                  accountTypeEnum.SIMPLE_UPDATE,
                  userId
                ),
                printServices.uploadJSON(
                  expensesBlob,
                  fileNamesSimpleUpdateEnum.EXPENSE_ID,
                  simpleState.account,
                  accountTypeEnum.SIMPLE_UPDATE,
                  userId
                ),
                printServices.uploadJSON(
                  configurationBlob,
                  fileNamesSimpleUpdateEnum.CONFIG_ID,
                  simpleState.account,
                  accountTypeEnum.SIMPLE_UPDATE,
                  userId
                ),
              ]);

              const response = await printServices.printSimpleCalc(simpleState.account.id);
              // PDF
              const dataUrlString = response.data;
              const buffer = decode(dataUrlString.split(',')[1]);
              const blob = new Blob([buffer], { type: 'application/pdf' });
              const urlBlob = URL.createObjectURL(blob);

              const win = window.open(urlBlob, '_blank');
              if (win)
                win.onload = function () {
                  URL.revokeObjectURL(urlBlob);
                };
              alertMessage.success('Impresso com sucesso!');
              closeLoading();
            } catch (error) {
              closeLoading();
              throw error;
            } finally {
              closeLoading();
              upload_worker.terminate();
            }
            break;

          default:
            throw new Error();
        }
      } catch (error) {
        console.log(error);
        alertMessage.dangerError(error.message || 'Não foi possível realizar a impressão. Por favor, tente novamente.');
        closeLoading();
      } finally {
        console.info('on_print_success');
        upload_worker.terminate();
      }
    });
  };

  const handlePrint = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      event.preventDefault();
      event.cancelable = true;

      openLoading();
      const config = await createConfig();

      onPrint(config);
    } catch (error) {
      console.log(error);
    } finally {
      closePrintModal();
      closeLoading();
    }
  };
  const onSaveDefaultConfig = async () => {
    try {
      openLoading();
      const config = await createConfig();
      if (simpleState) {
        const newConfig = { ...config, costCenterId: simpleState.account.costCenterId };
        await printServices.saveConfig(newConfig);
        closeLoading();
        return;
      }
      await printServices.saveConfig(config);
      closeLoading();
    } catch (error) {
      alertMessage.errorDangerOrPrimary('Não foi possível salvar a configuração. Por favor, tente novamente.', error);
    }
    closeLoading();
  };

  const createConfig = async (): Promise<PrintConfigImp> => {
    let newImageKey = imageKey;
    if (imageToUpload) {
      const { url, key } = await printServices.getUploadImageUrl(imageToUpload.type);
      await printServices.uploadImage(imageToUpload, url);
      newImageKey = key;
      setImageToUpload(null);
      setImageKey(key);
    }

    return {
      imageAlign,
      header1,
      header2,
      header3,
      header4,
      signature,
      signature1,
      signature2,
      signature3,
      format,
      legibility: printLegibilityOption,
      accountName,
      numberOfPage,
      calculationMemory,
      observations,
      titleDescription,
      judgeCheck,
      installments,
      letterhead: true,
      centimeters,
      content: parseInt(content),
      imageKey: newImageKey,
    };
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event?.preventDefault();

    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImageToUpload(img);
      setCurrentImage(URL.createObjectURL(img));
    }
  };

  const removeImage = () => {
    setImageToUpload(initialImageStates.imageToUpload);
    setCurrentImage(initialImageStates.currentImage);
    setRemoveImageModal(false);
    setImageKey('');
  };

  const renderImage = () => {
    if (currentImage) {
      return currentImage;
    }
    return DropImage;
  };

  const onClose = () => {};

  const closePrintModal = () => {
    clearPrintData();
    onClose();
  };

  const clearPrintData = () => {
    setHeader1('');
    setHeader2('');
    setHeader3('');
    setHeader4('');
    setSignature(false);
    setSignature1('');
    setSignature2('');
    setSignature3('');
    setAccountName(true);
    setNumberOfPage(true);
    setCalculationMemory(true);
    setObservations(true);
    setTitleDescription(true);
    setJudgeCheck(false);
    setInstallments(true);
    setCentimeters(0);
    setImageKey('');
    setCurrentImage('');
    setFormat('PDF');
    setPrintLegibilityOption('Normal');
  };

  const loadConfig = async () => {
    openLoading();
    clearPrintData();
    try {
      const configuration = await printServices.getConfig(simpleState?.account.costCenterId);
      if (configuration) {
        setHeader1(configuration.header.header1);
        setHeader2(configuration.header.header2);
        setHeader3(configuration.header.header3);
        setHeader4(configuration.header.header4);
        setAccountName(configuration.accountName);
        setCalculationMemory(configuration.calculationMemory);
        setObservations(configuration.observations);
        setTitleDescription(configuration.titleDescription);
        setJudgeCheck(configuration.judgeCheck);
        setInstallments(configuration.installments);
        setCentimeters(configuration.centimeters || 0);
        setSignature(configuration.signature);
        setSignature1(configuration.signatures.signature1);
        setSignature2(configuration.signatures.signature2);
        setSignature3(configuration.signatures.signature3);
        setContent(configuration.content);
        setFormat(configuration.format || 'PDF');
        setPrintLegibilityOption(configuration.legibility || 'Normal');
        setNumberOfPage(configuration.numberOfPage);
        if (configuration.imageKey) {
          const { Body } = await S3.getValue(configuration.imageKey);
          const BodyS3: any | undefined = Body;
          if (BodyS3) {
            const buffer = Buffer.from(BodyS3);
            const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
            setCurrentImage(base64Image);
          }
          setImageKey(configuration.imageKey);
        }
      }
      closeLoading();
    } catch (error) {
      closeLoading();
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (simpleState.actions.print.modal.visible && hasPermissionToSave) {
      // fetchIndicators();
      loadConfig();
    }
  }, [simpleState.actions.print.modal.visible, hasPermissionToSave]);

  useEffect(() => {
    clearPrintData();
  }, [simpleState?.account.costCenterId]);

  return (
    <SystemModal shouldCloseOnEsc={true} modalIsOpen={simpleState.actions.print.modal.visible}>
      <form onSubmit={handlePrint}>
        <header>
          <h2>Configuração de impressão</h2>
        </header>
        <div>
          <div>
            {ability.can('add', 'PrintHeader') && (
              <div>
                <label>Cabeçalho</label>
                <FormGroup
                  id="registerHeaderOne"
                  name="headerLineOne"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHeader1(e.target.value)}
                  type="text"
                  label=""
                  value={header1}
                  placeholder="Conteúdo da linha 1"
                />
                <FormGroup
                  id="registerHeaderTwo"
                  name="headerLineTwo"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHeader2(e.target.value)}
                  type="text"
                  label=""
                  value={header2}
                  placeholder="Conteúdo da linha 2"
                />
                <FormGroup
                  id="registerHeaderThree"
                  name="headerLineThree"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHeader3(e.target.value)}
                  type="text"
                  label=""
                  value={header3}
                  placeholder="Conteúdo da linha 3"
                />
                <FormGroup
                  id="registerHeaderFour"
                  name="headerLineFour"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setHeader4(e.target.value)}
                  type="text"
                  label=""
                  value={header4}
                  placeholder="Conteúdo da linha 4"
                />
              </div>
            )}
            <div>
              <div>
                <label>Imagem</label>
                <div>
                  <img loading="lazy" id="imageid" src={renderImage()} />
                  <input
                    ref={imageInput}
                    accept="image/png"
                    type="file"
                    id="file"
                    name="myImage"
                    onChange={onImageChange}
                  />
                  <div>
                    <button onClick={addImage}>Escolher Arquivo</button>
                    <span>{currentImage ? imageToUpload?.name : 'Nenhum arquivo escolhido'}</span>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <button type="button" onClick={addImage}>
                    <AiFillFileAdd />
                  </button>
                  <button type="button" onClick={() => setRemoveImageModal(true)}>
                    <AiFillDelete />
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className={`${imageAlign === 'left' ? 'active' : ''} btn toolbar-button btn-outline-square-icon`}
                    onClick={() => setImageAlign('left')}>
                    <MdFormatAlignLeft />
                  </button>
                  <button
                    type="button"
                    className={`${imageAlign === 'center' ? 'active' : ''} btn toolbar-button btn-outline-square-icon`}
                    onClick={() => setImageAlign('center')}>
                    <MdFormatAlignCenter />
                  </button>
                  <button
                    type="button"
                    className={`${imageAlign === 'right' ? 'active' : ''} btn toolbar-button btn-outline-square-icon`}
                    onClick={() => setImageAlign('right')}>
                    <MdFormatAlignRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label
              style={{
                marginBottom: '10px',
                marginTop: '20px',
                display: 'block',
              }}>
              Imprimir
            </label>
            <CustomCheckbox
              id="print-signature"
              name="signature"
              onChange={() => setSignature(!signature)}
              label="Assinatura"
              checked={signature}
            />
            <div>
              <div>
                <FormGroup
                  id="registerSignature1"
                  name="signature1"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSignature1(e.target.value)}
                  type="text"
                  label=""
                  placeholder="Nome"
                  value={signature1}
                />
                <FormGroup
                  id="registerSignature2"
                  name="signature2"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSignature2(e.target.value)}
                  type="text"
                  label=""
                  placeholder="Cargo"
                  value={signature2}
                />
                <FormGroup
                  id="registerSignature3"
                  name="signature3"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSignature3(e.target.value)}
                  type="text"
                  label=""
                  placeholder="Local"
                  value={signature3}
                />
                <div>
                  <label>Impressão</label>

                  <div>
                    <CustomSelect
                      id="simple-print-format-select"
                      label="Formato"
                      name="printFormat"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value)}
                      options={formatOptions}
                      value={format}
                      defaultValue={formatOptions[0]}
                    />
                    <CustomSelect
                      id="simple-print-legibility-select"
                      label="Legibilidade"
                      name="printLegibility"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPrintLegibilityOption(e.target.value)}
                      options={printLegibilityOptions}
                      value={printLegibilityOption}
                      defaultValue={printLegibilityOptions[0]}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-cb-name"
                      name="cb-name"
                      onChange={() => setAccountName(!accountName)}
                      label="Nome do cálculo no rodapé"
                      checked={accountName}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-number-of-page"
                      name="number-of-page"
                      onChange={() => setNumberOfPage(!numberOfPage)}
                      label="Número das páginas"
                      checked={numberOfPage}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-calculation-memory"
                      name="calculation-memory"
                      onChange={() => setCalculationMemory(!calculationMemory)}
                      label={getFieldName(labelsEnum.MEM_CALC, nomenclatures)}
                      checked={calculationMemory}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-observations"
                      name="observations"
                      onChange={() => setObservations(!observations)}
                      label={getFieldName(labelsEnum.OBSERVATION, nomenclatures)}
                      checked={observations}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-title-description"
                      name="title-description"
                      onChange={() => setTitleDescription(!titleDescription)}
                      label="Descrição do título"
                      checked={titleDescription}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-judge-check"
                      name="judge-check"
                      onChange={() => setJudgeCheck(!judgeCheck)}
                      label="Visto do juiz"
                      checked={judgeCheck}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-number-of-installments"
                      name="number-of-installments"
                      onChange={() => setInstallments(!installments)}
                      label="Número das parcelas"
                      checked={installments}
                    />
                  </div>
                </div>
                <div>
                  <FormGroup
                    id="centimeters"
                    name="centimeters"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCentimeters(+e.target.value)}
                    type="number"
                    label="Centimetros papel timbrado"
                    placeholder=""
                    value={centimeters}
                  />
                </div>
                <div>
                  <div>
                    <CustomSelect
                      id="simple-update-cost-center"
                      label="O QUE DESEJA IMPRIMIR?"
                      name="costCenter"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContent(e.target.value)}
                      options={contentOptions}
                      value={content}
                      defaultValue={contentOptions[0]}
                    />
                    <button style={{ marginBottom: '20px' }} type="button" onClick={onSaveDefaultConfig}>
                      Salvar
                    </button>
                  </div>
                  <div>
                    <button type="submit">Imprimir</button>
                    <button onClick={closePrintModal} type="button">
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <AlertModal
          message="Tem certeza que deseja excluir a imagem?"
          modalIsOpen={removeImageModal}
          onConfirm={removeImage}
          onCancel={() => setRemoveImageModal(false)}
          onClose={() => setRemoveImageModal(false)}
        /> */}
      </form>
    </SystemModal>
  );
};

export default Print;
