import React, { useState, useEffect, useRef } from 'react';
import FormGroup from '@components/FormGroup';
import CustomCheckbox from '@components/CustomCheckbox';
import CustomSelect from '@components/CustomSelect';
import SystemModal from '@components/SystemModal';
import { AiFillFileAdd, AiFillDelete } from 'react-icons/ai';
import { MdFormatAlignCenter, MdFormatAlignRight, MdFormatAlignLeft } from 'react-icons/md';
import DropImage from '@/images/drop-image.png';
import { ApplicationState } from '@store/index';
import { useDispatch, useSelector } from 'react-redux';
// import AlertModal from '@components/AlertModal';

import NomenclatureImp from '@interfaces/NomenclatureImp';
import PrintFinancingConfigImp from '@interfaces/PrintFinancingConfigImp';
import { AWSS3 } from '@services/S3';
import FinancingPrint from '@/services/PrintServices/Financing';

import { alertMessages } from '@/hooks/alertMessages';
import { useLoading } from '@/hooks/loading';

const formatOptions = [
  {
    id: 1,
    label: 'PDF',
    value: 'PDF',
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

interface IProps {
  modalIsOpen: boolean;
  onClose: Function;
  financing?: any;
  hasPermissionToSave?: boolean;
  nomenclatures?: NomenclatureImp[];
}

const PrintFinancing = ({ financing, modalIsOpen, onClose, hasPermissionToSave = true }: IProps) => {
  const dispatch = useDispatch();
  const alertMessage = alertMessages();

  const printServices = new FinancingPrint();

  const [format, setFormat] = useState('PDF');
  const [printLegibilityOption, setPrintLegibilityOption] = useState('Normal');

  const [imageAlign, setImageAlign] = useState('left');

  const [signature, setSignature] = useState(true);

  const [signature1, setSignature1] = useState('');

  const [numberOfPage, setNumberOfPage] = useState(false);
  const [letterhead, setLetterhead] = useState(false);
  const [centimeters, setCentimeters] = useState(0);
  const [imageKey, setImageKey] = useState('');

  const { closeLoading, openLoading } = useLoading();

  // const [loadingMessage, setLoadingMessage] = useState('');
  const [imageToUpload, setImageToUpload] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>();
  const [removeImageModal, setRemoveImageModal] = useState<boolean>(false);

  const { ability } = useSelector((state: ApplicationState) => state.auth);

  const imageInput: any = useRef(null);

  const addImage = () => {
    imageInput?.current?.click();
  };

  const getPreviewImage = async (key: string) => {
    const s3 = new AWSS3();
    const data = s3.getValue(key);
    return data;
  };

  const onPrint = async () => {
    try {
      openLoading();
      // setLoadingMessage('Sua impressão está sendo preparada');
      const config = await createConfig();
      await printServices.printFinancing(config, financing);
    } catch (error) {
      alertMessage.errorDangerOrPrimary('Não foi possível realizar a impressão. Por favor, tente novamente.', error);
    }
    closeLoading();
    // setLoadingMessage('');
  };

  const onSaveDefaultConfig = async () => {
    try {
      openLoading();
      // setLoadingMessage('Salvando a configuração');
      const config = await createConfig();
      await printServices.saveFinancingConfig(config);
      closeLoading();
    } catch (error) {
      alertMessage.errorDangerOrPrimary('Não foi possível salvar a configuração. Por favor, tente novamente.', error);
    }
    closeLoading();
    // setLoadingMessage('');
  };

  const createConfig = async (): Promise<PrintFinancingConfigImp> => {
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
      signature,
      signature1,
      format,
      numberOfPage,
      letterhead,
      centimeters,
      imageKey: newImageKey,
    };
  };

  const onImageChange = (event: any) => {
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

  const closePrintModal = () => {
    clearPrintData();
    onClose();
  };

  const clearPrintData = () => {
    setSignature(false);
    setSignature1('');
    setNumberOfPage(false);
    setLetterhead(false);
    setCentimeters(0);
    setImageKey('');
    setCurrentImage('');
    setFormat('PDF');
    setPrintLegibilityOption('Normal');
  };

  const loadConfig = async () => {
    clearPrintData();
    try {
      openLoading();
      const configuration = await printServices.getConfig(null);
      if (configuration) {
        setLetterhead(configuration.letterhead || false);
        setCentimeters(configuration.centimeters || 0);
        setSignature(configuration.signature);
        setSignature1(configuration.signatures.signature1);
        // setContent(configuration.content);
        setFormat(configuration.format || 'PDF');
        setPrintLegibilityOption(configuration.legibility || 'Normal');
        setNumberOfPage(configuration.numberOfPage);
        if (configuration.imageKey) {
          const { Body } = await getPreviewImage(configuration.imageKey);
          const BodyS3: any | undefined = Body;
          if (BodyS3) {
            const buffer = Buffer.from(BodyS3);
            const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
            setCurrentImage(base64Image);
          }
          setImageKey(configuration.imageKey);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      closeLoading();
    }
  };

  useEffect(() => {
    if (hasPermissionToSave) {
      loadConfig();
      return;
    }
    closeLoading();
  }, [modalIsOpen]);

  useEffect(() => {
    setSignature1(financing.name);
  }, [financing]);

  return (
    <SystemModal shouldCloseOnEsc={true} modalIsOpen={modalIsOpen} shouldCloseOnOverlayClick={true}>
      <div>
        <header>
          <h2>Configuração de impressão</h2>
        </header>
        <div>
          <div>
            {ability.can('add', 'PrintHeader')}
            <div>
              <div>
                <label>Imagem</label>
                <div>
                  <img loading="lazy" id="imageid" src={renderImage()} />
                  <input
                    ref={imageInput}
                    accept="image/png,image/jpeg"
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
            <div>
              <div>
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
                      id="print-number-of-page"
                      name="number-of-page"
                      onChange={() => setNumberOfPage(!numberOfPage)}
                      label="Número das páginas"
                      checked={numberOfPage}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <CustomCheckbox
                      id="print-letterhead"
                      name="letterhead"
                      onChange={() => setLetterhead(!letterhead)}
                      label="Papel timbrado"
                      checked={letterhead}
                    />
                  </div>
                </div>
                <div>
                  <FormGroup
                    id="centimeters"
                    name="centimeters"
                    onChange={(e: any) => setCentimeters(+e.target.value)}
                    type="number"
                    label="Centimetros papel timbrado"
                    placeholder=""
                    value={centimeters}
                  />
                </div>
                <div>
                  <div>
                    <button style={{ marginBottom: '20px' }} type="button" onClick={onSaveDefaultConfig}>
                      Salvar
                    </button>
                  </div>
                  <div>
                    <button onClick={onPrint} type="button">
                      Imprimir
                    </button>
                    <button onClick={closePrintModal} type="button">
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <AlertModal
          message="Tem certeza que deseja excluir a imagem?"
          modalIsOpen={removeImageModal}
          onConfirm={removeImage}
          onCancel={() => setRemoveImageModal(false)}
          onClose={() => setRemoveImageModal(false)}
        /> */}
      </div>
    </SystemModal>
  );
};

export default PrintFinancing;
