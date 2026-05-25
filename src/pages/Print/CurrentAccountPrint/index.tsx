import CustomCheckbox from '@components/CustomCheckbox';
import CustomSelect from '@components/CustomSelect';
import { ApplicationState } from '@store/index';
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { AiFillDelete, AiFillFileAdd } from 'react-icons/ai';
import { MdFormatAlignCenter, MdFormatAlignLeft, MdFormatAlignRight } from 'react-icons/md';
import { useSelector } from 'react-redux';
import DropImage from '@/images/drop-image.png';
import IDummyObject from '@interfaces/IDummyObject';
import { AWSS3 } from '@services/S3';
import * as msgpack from 'msgpack-lite';
import upload_worker_script from '@//workersweb/upload';
import ViewOccorrenceImp from '@/interfaces/calculations/ViewOccorrenceImp';
import { ConfigurationObjectImp, ImageAlignImp } from '@/interfaces/ConfigurationObjectImp';
import AccountImp from '@/interfaces/AccountImp';
import CurrentAccountPrint from '@/services/PrintServices/CurrentAccount';
import currentAccountPrintSchema from '@/validators/calculations/currentAccount/currentAccountPrintSchema';
import PositionEnum from '@/enums/PositionEnum';
import { alertMessages } from '@/hooks/alertMessages';
import { pathEnum } from '@/enums/pathEnum';
import { useLoading } from '@/hooks/loading';
import useCurrentAccount from '@/hooks/currentAccount';
import DefaultModal from '@/components/DefaultModal';
import { Formik, useFormikContext } from 'formik';
import DefaultInput from '@/components/DefaultInput';
import { fileNamesCurrentAccountEnum } from '@/enums/fileNamesEnum';
import { accountTypeEnum } from '@/enums/accountTypeEnum';
const { renderAsync } = require('docx-preview');
import html2pdf from 'html2pdf.js';
import {
  CheckboxContainer,
  Config,
  Container,
  ContainerButton,
  DividerButton,
  DividerCheckbox,
  Form,
  Header,
  Image,
  ImageConfig,
  Input,
  RemoveImage,
  Row,
  SelectContainer,
  ToolsContainerModal,
} from './styles';
import { ButtonAction } from '@/components/ToolBar/styles';
import exportToExcel from '@/utils/exportToExcel';
import ViewModal from '@/pages/calculations/Current/ViewModal';
import { IoIosSettings } from 'react-icons/io';
import { useUser } from '@/hooks/user';
import FontModal from '@/components/FontModal';
import { ButtonDefault } from '@/styles/global';
import { timeoutEnum } from '@/enums/TimeoutEnum';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { labelsEnum } from '@/enums/labelsEnum';
import { getFieldName } from '@/lib/nomenclature';

const formatOptions = [
  {
    id: 1,
    label: 'DOC',
    value: 'DOC',
  },
  {
    id: 2,
    label: 'XLS',
    value: 'XLS',
  },
  {
    id: 3,
    label: 'PDF',
    value: 'PDF',
  },
];

const detailmentOptions = [
  {
    id: 0,
    label: 'Nenhum',
    value: 'none',
  },
  {
    id: 1,
    label: 'Normal',
    value: 'normal',
  },
  {
    id: 2,
    label: 'Completo',
    value: 'complete',
  },
];

const contentOptions = [
  {
    id: 0,
    label: 'Todo o cálculo',
    value: 0,
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
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface CurrentAccountPrintConfig {
  configuration: ConfigurationObjectImp;
}

const initialValues = {
  loading: true,
  costCenterId: '',
  accountName: true,
  calculationMemory: true,
  centimeters: 0,
  content: 0,
  details: false,
  format: formatOptions[0].value,
  detailment: detailmentOptions[1].value,
  imageAlign: PositionEnum.LEFT,
  legibility: '',
  letterhead: true,
  numberOfPage: true,
  observations: true,
  signature: true,
  judgeCheck: false,
  headerSetting1: {
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  },
  headerSetting2: {
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  },
  headerSetting3: {
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  },
  headerSetting4: {
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
  },
  type: '',
  header1: '',
  headerSetting1Font: 'Arial',
  headerSetting1FontSize: 18,
  headerSetting1FontStyle: 'Regular',
  headerSetting1FontStyleCheck: 'none',
  headerSetting1FontColor: '#000000',
  header2: '',
  headerSetting2Font: 'Arial',
  headerSetting2FontSize: 18,
  headerSetting2FontStyle: 'Regular',
  headerSetting2FontStyleCheck: 'none',
  headerSetting2FontColor: '#000000',
  header3: '',
  headerSetting3Font: 'Arial',
  headerSetting3FontSize: 18,
  headerSetting3FontStyle: 'Regular',
  headerSetting3FontStyleCheck: 'none',
  headerSetting3FontColor: '#000000',
  header4: '',
  headerSetting4Font: 'Arial',
  headerSetting4FontSize: 18,
  headerSetting4FontStyle: 'Regular',
  headerSetting4FontStyleCheck: 'none',
  headerSetting4FontColor: '#000000',
  signature1: '',
  signature2: '',
  signature3: '',
  imageKey: '',
};

const PrintCurrentAccountModal = ({ open, setOpen }: PropsImp): JSX.Element => {
  const { closeLoading, openLoading } = useLoading();
  const alertMessage = alertMessages();

  const S3 = new AWSS3();
  const printServices = new CurrentAccountPrint();

  const [headerName, setHeaderName] = useState('');
  const [format, setFormat] = useState(formatOptions[0].value);
  const [detailment, setDetailment] = useState(detailmentOptions[1].value);
  const [content, setContent] = useState('0');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const [imageAlign, setImageAlign] = useState<ImageAlignImp>(PositionEnum.LEFT);

  const { values, setValues } = useFormikContext<IDummyObject>();

  const [imageKey, setImageKey] = useState('');
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>();
  const [removeImageModal, setRemoveImageModal] = useState<boolean>(false);

  const imageInput: any = useRef(null);
  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const {
    user: { id: userId },
  } = useUser();

  const {
    account,
    layout: {
      footerButton: { isLoading, isCalculated },
      viewModal: { views },
    },
    onCalc,
  } = useCurrentAccount();

  const { nomenclatures } = useNomenclatures();

  const addImage = (event: React.MouseEvent) => {
    removeImage();
    event.preventDefault();
    setTimeout(() => {
      imageInput?.current?.click();
    }, timeoutEnum.HALF_SECONDS);
  };

  const printAccount = (param: CurrentAccountPrintConfig) => {
    const upload_worker = new Worker(upload_worker_script);
    openLoading();

    async function encodeToBlobText(input: IDummyObject) {
      const inputBytes = msgpack.encode(input);
      const blob = new Blob([inputBytes.buffer] as any, { type: 'application/octet-stream' });
      return blob;
    }

    upload_worker.postMessage({ type: 'upload' });
    upload_worker.addEventListener('message', async function (event) {
      try {
        console.info('on_print');
        const message = event.data;

        console.info('on_print_validated');
        interface PrintValidateResponse {
          views: ViewOccorrenceImp[];
          configuration: ConfigurationObjectImp;
          account: AccountImp;
        }
        const params: PrintValidateResponse = {
          views,
          configuration: {
            ...param.configuration,
            format: values.format.includes('PDF') ? 'DOC' : values.format,
          },
          account: account.current,
        };

        const payload: any = await currentAccountPrintSchema.validate(params);
        closePrintModal();

        switch (message.type) {
          case 'uploaded':
            try {
              const [viewsBlob, configurationBlob, accountBlob] = await Promise.all([
                encodeToBlobText(payload.views),
                encodeToBlobText(payload.configuration),
                encodeToBlobText(payload.account),
              ]);

              await Promise.all([
                printServices.uploadJSON(
                  viewsBlob,
                  fileNamesCurrentAccountEnum.VIEW_ID,
                  account.current,
                  accountTypeEnum.CURRENT_ACCOUNT,
                  userId
                ),
                printServices.uploadJSON(
                  configurationBlob,
                  fileNamesCurrentAccountEnum.CONFIG_ID,
                  account.current,
                  accountTypeEnum.CURRENT_ACCOUNT,
                  userId
                ),
                printServices.uploadJSON(
                  accountBlob,
                  fileNamesCurrentAccountEnum.ACCOUNT_ID,
                  account.current,
                  accountTypeEnum.CURRENT_ACCOUNT,
                  userId
                ),
              ]);

              const response = await printServices.printCurrentCalc(account.current.id);
              const base64Content = response.data;

              const decodedContent = atob(base64Content);

              const byteArray = new Uint8Array(decodedContent.length);
              for (let i = 0; i < decodedContent.length; i++) {
                byteArray[i] = decodedContent.charCodeAt(i);
              }

              if (values.format == 'DOC') {
                const blob = new Blob([byteArray], {
                  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                });

                const urlBlob = URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = urlBlob;
                link.download = `${account.current.name || 'documento'}.docx`;
                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);
              }

              if (values.format == 'PDF') {
                const container = document.createElement('output');

                await renderAsync(byteArray, container, undefined, {
                  inWrapper: false,
                });

                const options = {
                  filename: `${account.current.name || 'documento'}.pdf`,
                  jsPDF: { orientation: 'landscape' },
                  html2canvas: { scale: 2 },
                  pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    avoid: ['tr', 'img', 'canvas'],
                  },
                };

                html2pdf().set(options).from(container).save();
              }

              alertMessage.success('Impresso com sucesso!');
            } catch (error) {
              closePrintModal();
              console.log(error);
              alertMessage.dangerError('Não foi possível realizar a impressão. Por favor, tente novamente.');
            } finally {
              closeLoading();
              upload_worker.terminate();
            }
            break;

          default:
            closePrintModal();
        }
        closeLoading();
      } catch (error) {
        console.log(error);

        alertMessage.error(error.message);
        closeLoading();
      } finally {
        console.info('on_print_success');
        upload_worker.terminate();
      }
    });
  };

  const onSaveDefaultConfig = async () => {
    let imageKey: string | undefined = '';
    try {
      openLoading();
      const config = await createConfig();
      await printServices.saveConfig(config, pathEnum.CURRENT_ACCOUNT);
      imageKey = config.configuration.imageKey;
      closeLoading();
      alertMessage.success('Configuração salva com sucesso!');
    } catch (error) {
      alertMessage.errorDangerOrPrimary('Não foi possível salvar a configuração. Por favor, tente novamente.', error);
    }
    closeLoading();
  };

  const createConfig = async () => {
    let newImageKey = imageKey;

    if (imageToUpload) {
      const { url, key } = await printServices.getUploadImageUrl(imageToUpload.type);
      await printServices.uploadImage(imageToUpload, url);
      newImageKey = key;
      setImageToUpload(null);
      setImageKey(newImageKey);
    }

    const configuration: ConfigurationObjectImp = {
      costCenterId: account.current.costCenterId,
      calculationMemory: values.calculationMemory,
      judgeCheck: values.judgeCheck,
      centimeters: 0,
      content: 0,
      details: Boolean(values.details),
      detailment: values.detailment,
      format: values.format,
      imageAlign: imageAlign.length ? imageAlign : PositionEnum.LEFT,
      legibility: '',
      letterhead: Boolean(values.letterhead),
      numberOfPage: values.numberOfPage,
      observations: values.observations,
      signature: values.signature,
      type: account.infos.type,
      header: {
        header1: {
          value: values.header1,
          config: {
            font: values.headerSetting1Font,
            fontSize: values.headerSetting1FontSize,
            fontStyle: values.headerSetting1FontStyle,
            fontStyleCheck: values.headerSetting1FontStyleCheck,
            fontColor: values.headerSetting1FontColor,
            align: values['headerSetting1'],
          },
        },
        header2: {
          value: values.header2,
          config: {
            font: values.headerSetting2Font,
            fontSize: values.headerSetting2FontSize,
            fontStyle: values.headerSetting2FontStyle,
            fontStyleCheck: values.headerSetting2FontStyleCheck,
            fontColor: values.headerSetting2FontColor,
            align: values['headerSetting2'],
          },
        },
        header3: {
          value: values.header3,
          config: {
            font: values.headerSetting3Font,
            fontSize: values.headerSetting3FontSize,
            fontStyle: values.headerSetting3FontStyle,
            fontStyleCheck: values.headerSetting3FontStyleCheck,
            fontColor: values.headerSetting3FontColor,
            align: values['headerSetting3'],
          },
        },
        header4: {
          value: values.header4,
          config: {
            font: values.headerSetting4Font,
            fontSize: values.headerSetting4FontSize,
            fontStyle: values.headerSetting4FontStyle,
            fontStyleCheck: values.headerSetting4FontStyleCheck,
            fontColor: values.headerSetting4FontColor,
            align: values['headerSetting4'],
          },
        },
      },
      signatures: {
        signature1: values.signature1,
        signature2: values.signature2,
        signature3: values.signature3,
      },
      imageKey: newImageKey,
    };

    return { configuration };
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

  const onClose = () => {
    setOpen(false);
  };

  const closePrintModal = () => {
    clearPrintData();
    onClose();
  };

  const clearPrintData = () => {
    setValues(values => ({
      ...values,
      ...initialValues,
    }));
  };

  useEffect(() => {
    clearPrintData();
  }, [account.current.costCenterId]);

  const fetchConfig = useCallback(async () => {
    try {
      const configuration = (await printServices.getConfig(account.current.costCenterId)) as ConfigurationObjectImp;

      if (configuration) {
        const initialHeaderConfig = {
          font: 'Arial',
          fontSize: 18,
          fontStyle: 'Regular',
          fontStyleCheck: 'none',
          fontColor: '#000000',
          align: {
            alignCenter: false,
            alignLeft: false,
            alignRight: false,
          },
        };

        const newValues = {
          ...configuration.header,
          calculationMemory: configuration.calculationMemory,
          observations: configuration.observations,
          centimeters: configuration.centimeters || 0,
          signature: configuration.signature,
          signature1: configuration.signatures.signature1,
          signature2: configuration.signatures.signature2,
          signature3: configuration.signatures.signature3,
          header1: configuration.header.header1.value,
          header2: configuration.header.header2.value,
          header3: configuration.header.header3.value,
          header4: configuration.header.header4.value,
          headerSetting1: {
            alignLeft: configuration.header.header1?.config?.align.alignLeft || initialHeaderConfig.align.alignLeft,
            alignCenter:
              configuration.header.header1?.config?.align.alignCenter || initialHeaderConfig.align.alignCenter,
            alignRight: configuration.header.header1?.config?.align.alignRight || initialHeaderConfig.align.alignRight,
          },
          headerSetting1Font: configuration.header.header1?.config?.font || initialHeaderConfig.font,
          headerSetting1FontSize: configuration.header.header1?.config?.fontSize || initialHeaderConfig.fontSize,
          headerSetting1FontStyle: configuration.header.header1?.config?.fontStyle || initialHeaderConfig.fontStyle,
          headerSetting1FontStyleCheck:
            configuration.header.header1?.config?.fontStyleCheck || initialHeaderConfig.fontStyleCheck,
          headerSetting1FontColor: configuration.header.header1?.config?.fontColor || initialHeaderConfig.fontColor,
          headerSetting2: {
            alignLeft: configuration.header.header2?.config?.align.alignLeft || initialHeaderConfig.align.alignLeft,
            alignCenter:
              configuration.header.header2?.config?.align.alignCenter || initialHeaderConfig.align.alignCenter,
            alignRight: configuration.header.header2?.config?.align.alignRight || initialHeaderConfig.align.alignRight,
          },
          headerSetting2Font: configuration.header.header2?.config?.font || initialHeaderConfig.font,
          headerSetting2FontSize: configuration.header.header2?.config?.fontSize || initialHeaderConfig.fontSize,
          headerSetting2FontStyle: configuration.header.header2?.config?.fontStyle || initialHeaderConfig.fontStyle,
          headerSetting2FontStyleCheck:
            configuration.header.header2?.config?.fontStyleCheck || initialHeaderConfig.fontStyleCheck,
          headerSetting2FontColor: configuration.header.header2?.config?.fontColor || initialHeaderConfig.fontColor,
          headerSetting3: {
            alignLeft: configuration.header.header3?.config?.align.alignLeft || initialHeaderConfig.align.alignLeft,
            alignCenter:
              configuration.header.header3?.config?.align.alignCenter || initialHeaderConfig.align.alignCenter,
            alignRight: configuration.header.header3?.config?.align.alignRight || initialHeaderConfig.align.alignRight,
          },
          headerSetting3Font: configuration.header.header3?.config?.font || initialHeaderConfig.font,
          headerSetting3FontSize: configuration.header.header3?.config?.fontSize || initialHeaderConfig.fontSize,
          headerSetting3FontStyle: configuration.header.header3?.config?.fontStyle || initialHeaderConfig.fontStyle,
          headerSetting3FontStyleCheck:
            configuration.header.header3?.config?.fontStyleCheck || initialHeaderConfig.fontStyleCheck,
          headerSetting3FontColor: configuration.header.header3?.config?.fontColor || initialHeaderConfig.fontColor,
          headerSetting4: {
            alignLeft: configuration.header.header4?.config?.align.alignLeft || initialHeaderConfig.align.alignLeft,
            alignCenter:
              configuration.header.header4?.config?.align.alignCenter || initialHeaderConfig.align.alignCenter,
            alignRight: configuration.header.header4?.config?.align.alignRight || initialHeaderConfig.align.alignRight,
          },
          headerSetting4Font: configuration.header.header4?.config?.font || initialHeaderConfig.font,
          headerSetting4FontSize: configuration.header.header4?.config?.fontSize || initialHeaderConfig.fontSize,
          headerSetting4FontStyle: configuration.header.header4?.config?.fontStyle || initialHeaderConfig.fontStyle,
          headerSetting4FontStyleCheck:
            configuration.header.header4?.config?.fontStyleCheck || initialHeaderConfig.fontStyleCheck,
          headerSetting4FontColor: configuration.header.header4?.config?.fontColor || initialHeaderConfig.fontColor,
          format: configuration.format || formatOptions[0].value,
          legibility: configuration.legibility || 'Normal',
          detailment: configuration.detailment || 'normal',
          numberOfPage: configuration.numberOfPage,
          imageAlign: PositionEnum.LEFT,
          imageKey: '',
        };

        if (configuration.imageKey?.length) {
          const { Body } = await S3.getValue(configuration.imageKey);
          const BodyS3: any | undefined = Body;
          if (BodyS3) {
            const buffer = Buffer.from(BodyS3);
            const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
            setCurrentImage(base64Image);
            setImageKey(configuration.imageKey);
          }

          newValues.imageKey = configuration.imageKey;
        }
        setValues(newValues);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account.current.costCenterId]);

  useEffect(() => {
    if (!open) return;
    onCalc({ origin: 'calc', changeUpdateTo: false, nomenclatures });
  }, [open, nomenclatures]);

  useEffect(() => {
    if (open) fetchConfig();
  }, [open]);

  useEffect(() => {
    if (isCalculated && !isLoading) {
      setValues(values => ({ ...values, loading: false }));
    }
  }, [isCalculated, isLoading]);

  const onPrint = useCallback(async () => {
    const config = await createConfig();
    printAccount(config);
  }, [values, views, imageToUpload, account]);

  return (
    <DefaultModal
      isOpen={open && !values.loading}
      onCancel={() => {
        closePrintModal();
      }}
      onClose={() => {
        closePrintModal();
      }}
      onConfirm={() => {
        format == 'XLS' ? exportToExcel('viewer-table', account.current.name) : onPrint();
      }}
      onSave={onSaveDefaultConfig}
      title="Configuração de impressão">
      <Form>
        <Container>
          <Header>
            {ability.can('add', 'PrintHeader') && (
              <Fragment>
                <label>Cabeçalho</label>
                <DefaultInput
                  onIconClick={() => setHeaderName('headerSetting1')}
                  icon={IoIosSettings}
                  name="header1"
                  type="text"
                  placeholder="Conteúdo da linha 1"
                />
                <DefaultInput
                  onIconClick={() => setHeaderName('headerSetting2')}
                  icon={IoIosSettings}
                  name="header2"
                  type="text"
                  placeholder="Conteúdo da linha 2"
                />
                <DefaultInput
                  onIconClick={() => setHeaderName('headerSetting3')}
                  icon={IoIosSettings}
                  name="header3"
                  type="text"
                  placeholder="Conteúdo da linha 3"
                />
                <DefaultInput
                  onIconClick={() => setHeaderName('headerSetting4')}
                  icon={IoIosSettings}
                  name="header4"
                  type="text"
                  placeholder="Conteúdo da linha 4"
                />
              </Fragment>
            )}
            <DividerCheckbox>
              <CustomCheckbox id="print-signature" className="print-signature" name="signature" label="Assinatura" />
              <CustomCheckbox id="print-judge-check" name="judgeCheck" label="Visto do juiz" />
            </DividerCheckbox>
            <DefaultInput name="signature1" type="text" placeholder="Nome" />
            <DefaultInput name="signature2" type="text" placeholder="Cargo" />
            <DefaultInput name="signature3" type="text" placeholder="Local" />
          </Header>

          <Image>
            <label>Imagem</label>
            <img loading="lazy" id="imageid" src={renderImage()} />

            <ImageConfig>
              <Input
                ref={imageInput}
                accept="image/png"
                type="file"
                id="file"
                name="myImage"
                onChange={onImageChange}
              />
              <DividerButton>
                <ButtonAction type="button" onClick={addImage}>
                  <AiFillFileAdd />
                </ButtonAction>
                <ButtonAction type="button" onClick={() => setRemoveImageModal(true)}>
                  <AiFillDelete />
                </ButtonAction>
              </DividerButton>
              <DividerButton>
                <ButtonAction
                  type="button"
                  isSelected={imageAlign.includes(PositionEnum.LEFT)}
                  onClick={() => setImageAlign(PositionEnum.LEFT)}>
                  <MdFormatAlignLeft />
                </ButtonAction>
                <ButtonAction
                  type="button"
                  isSelected={imageAlign.includes(PositionEnum.CENTER)}
                  onClick={() => setImageAlign(PositionEnum.CENTER)}>
                  <MdFormatAlignCenter />
                </ButtonAction>
                <ButtonAction
                  type="button"
                  isSelected={imageAlign.includes(PositionEnum.RIGHT)}
                  onClick={() => setImageAlign(PositionEnum.RIGHT)}>
                  <MdFormatAlignRight />
                </ButtonAction>
              </DividerButton>
            </ImageConfig>
          </Image>
        </Container>

        <Config>
          <label>Impressão</label>
          <SelectContainer>
            <CustomSelect
              id="simple-print-format-select"
              label="Formato"
              name="format"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormat(e.target.value)}
              options={formatOptions}
              value={format}
              defaultValue={formatOptions[0]}
            />
            <CustomSelect
              id="simple-print-detailment-select"
              label="Detalhamento"
              name="detailment"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDetailment(e.target.value)}
              options={detailmentOptions}
              value={detailment}
              defaultValue={detailmentOptions[1]}
            />
            <CustomSelect
              id="simple-print-legibility-select"
              label="Legibilidade"
              disabled={true}
              className="simple-print-legibility"
              name="printLegibilityOption"
              options={printLegibilityOptions}
              defaultValue={printLegibilityOptions[0]}
            />
            <CustomSelect
              id="simple-update-cost-center"
              label="O QUE DESEJA IMPRIMIR?"
              name="costCenter"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContent(e.target.value)}
              options={contentOptions}
              value={content}
              disabled={true}
              defaultValue={contentOptions[0]}
            />
          </SelectContainer>

          <CheckboxContainer>
            <CustomCheckbox id="print-cb-name" name="accountName" label="Nome do cálculo no rodapé" />

            <CustomCheckbox
              id="print-calculation-memory"
              label={getFieldName(labelsEnum.MEM_CALC, nomenclatures)}
              name="calculationMemory"
            />

            <CustomCheckbox
              id="print-observations"
              name="observations"
              label={getFieldName(labelsEnum.OBSERVATION, nomenclatures)}
            />

            <CustomCheckbox id="print-number-of-installments" name="numberOfPage" label="Número das parcelas" />
          </CheckboxContainer>
        </Config>

        <DefaultModal
          isOpen={removeImageModal}
          onConfirm={removeImage}
          title="Deseja remover a imagem?"
          onClose={() => setRemoveImageModal(false)}
          onCancel={() => setRemoveImageModal(false)}>
          <RemoveImage>
            <p>Ao confirmar estará removendo a imagem</p>
          </RemoveImage>
        </DefaultModal>

        <DefaultModal
          isOpen={!!headerName.length}
          onConfirm={() => {
            setHeaderName('');
          }}
          title="Opções"
          onClose={() => {
            setHeaderName('');
          }}
          onCancel={() => {
            setHeaderName('');
          }}>
          <ToolsContainerModal>
            <ContainerButton>
              <ButtonDefault type="button" onClick={openModal}>
                Formatar fonte...
              </ButtonDefault>

              {headerName.length && <FontModal name={headerName} isOpen={modalIsOpen} onRequestClose={closeModal} />}
            </ContainerButton>
            <CustomCheckbox
              id="align-left"
              className="align-left"
              name="alignLeft"
              label="Alinhar à esquerda"
              onChange={() => {
                setValues(values => ({
                  ...values,
                  [headerName]: { alignLeft: true, alignCenter: false, alignRight: false },
                }));
              }}
            />
            <CustomCheckbox
              id="align-right"
              className="align-right"
              name="alignRight"
              label="Alinhar à direita"
              onChange={() => {
                setValues(values => ({
                  ...values,
                  [headerName]: { alignRight: true, alignLeft: false, alignCenter: false },
                }));
              }}
            />
            <CustomCheckbox
              id="align-center"
              className="align-center"
              name="alignCenter"
              label="Centralizar"
              onChange={() => {
                setValues(values => ({
                  ...values,
                  [headerName]: { alignCenter: true, alignLeft: false, alignRight: false },
                }));
              }}
            />
          </ToolsContainerModal>
        </DefaultModal>

        <ViewModal isOpen />
      </Form>
    </DefaultModal>
  );
};

export const PrintCurrentAccount = ({ open, setOpen }: PropsImp) => {
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      <PrintCurrentAccountModal open={open} setOpen={setOpen} />
    </Formik>
  );
};

export default PrintCurrentAccount;
