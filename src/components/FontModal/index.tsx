import React, { useEffect } from 'react';
import {
  UpperContent,
  LowerContent,
  ModalContent,
  Label,
  Select,
  InputColor,
  Example,
  Border,
  ColumnContent,
  ViewerContent,
  EffectContent,
  CustomCheckboxContainer,
  BorderContent,
  LineContent,
} from './styles';
import DefaultModal from '../DefaultModal';
import CustomCheckbox from '../CustomCheckbox';
import { useFormikContext } from 'formik';

interface FontModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  name: string;
}

const FontModal: React.FC<FontModalProps> = ({ name, isOpen, onRequestClose }) => {
  const { setFieldValue, values } = useFormikContext<{ [key: string]: any }>();

  const fonts = [
    'Arial',
    'Arial Rounded MT',
    'Calibri',
    'Bahnschrift',
    'Baloo',
    'Baskerville Old Face',
    'Barlow',
    'Courier New',
    'Franklin',
    'Freehans521 BT',
    'Futura',
    'Georgia',
    'Lucida',
    'Script MT Bold',
    'Times New Roman',
    'Verdana',
  ];

  return (
    <DefaultModal
      isOpen={isOpen}
      onClose={onRequestClose}
      onCancel={onRequestClose}
      title="Fonte"
      onConfirm={onRequestClose}>
      <ModalContent>
        <UpperContent>
          <ColumnContent>
            <Label>Fonte:</Label>
            <Select>
              {fonts.sort().map((font, key) => (
                <option
                  key={key}
                  selected={values[`${name}Font`] == font}
                  onClick={() => setFieldValue(`${name}Font`, font)}>
                  {font}
                </option>
              ))}
            </Select>
          </ColumnContent>
          <ColumnContent>
            <Label>Estilo da fonte:</Label>

            <Select>
              <option
                selected={values[`${name}FontStyle`] == 'Regular'}
                onClick={() => setFieldValue(`${name}FontStyle`, 'Regular')}>
                Regular
              </option>
              <option
                selected={values[`${name}FontStyle`] == 'SemiCondensedBold'}
                onClick={() => setFieldValue(`${name}FontStyle`, 'SemiCondensedBold')}>
                Semicondensado Negrito
              </option>
              <option
                selected={values[`${name}FontStyle`] == 'SemiCondensedBoldItalic'}
                onClick={() => setFieldValue(`${name}FontStyle`, 'SemiCondensedBoldItalic')}>
                Semicondensado Negrito Itálico
              </option>
              <option
                selected={values[`${name}FontStyle`] == 'Bold'}
                onClick={() => setFieldValue(`${name}FontStyle`, 'Bold')}>
                Negrito
              </option>
              <option
                selected={values[`${name}FontStyle`] == 'ItalicBold'}
                onClick={() => setFieldValue(`${name}FontStyle`, 'ItalicBold')}>
                Itálico e negrito
              </option>
            </Select>
          </ColumnContent>
          <ColumnContent>
            <Label>Tamanho:</Label>

            <Select>
              <option selected={values[`${name}FontSize`] == 18} onClick={() => setFieldValue(`${name}FontSize`, 18)}>
                18
              </option>
              <option selected={values[`${name}FontSize`] == 20} onClick={() => setFieldValue(`${name}FontSize`, 20)}>
                20
              </option>
              <option selected={values[`${name}FontSize`] == 22} onClick={() => setFieldValue(`${name}FontSize`, 22)}>
                22
              </option>
              <option selected={values[`${name}FontSize`] == 24} onClick={() => setFieldValue(`${name}FontSize`, 24)}>
                24
              </option>
              <option selected={values[`${name}FontSize`] == 28} onClick={() => setFieldValue(`${name}FontSize`, 28)}>
                28
              </option>
              <option selected={values[`${name}FontSize`] == 36} onClick={() => setFieldValue(`${name}FontSize`, 36)}>
                36
              </option>
            </Select>
          </ColumnContent>
        </UpperContent>
        <LowerContent>
          <EffectContent>
            <Label>Efeitos:</Label>
            <Border>
              <BorderContent>
                <ColumnContent>
                  <CustomCheckboxContainer>
                    <CustomCheckbox
                      name="line-through"
                      checked={values[`${name}FontStyleCheck`] == 'line-through'}
                      onChange={() =>
                        values[`${name}FontStyleCheck`] == 'line-through'
                          ? setFieldValue(`${name}FontStyleCheck`, 'none')
                          : setFieldValue(`${name}FontStyleCheck`, 'line-through')
                      }
                      label="Riscado"
                    />
                  </CustomCheckboxContainer>
                  <CustomCheckboxContainer>
                    <CustomCheckbox
                      name="underline"
                      checked={values[`${name}FontStyleCheck`] == 'underline'}
                      onChange={() =>
                        values[`${name}FontStyleCheck`] == 'underline'
                          ? setFieldValue(`${name}FontStyleCheck`, 'none')
                          : setFieldValue(`${name}FontStyleCheck`, 'underline')
                      }
                      label="Sublinhado"
                    />
                  </CustomCheckboxContainer>
                </ColumnContent>

                <ColumnContent>
                  <Label>Cor:</Label>
                  <LineContent>
                    <InputColor type="color" name={`${name}FontColor`} />
                    <Label color={true}>{values[`${name}FontColor`]}</Label>
                  </LineContent>
                </ColumnContent>
              </BorderContent>
            </Border>
          </EffectContent>

          <ViewerContent>
            <Label>Exemplo:</Label>
            <Border>
              <ColumnContent>
                <Example
                  fontStyleCheck={values[`${name}FontStyleCheck`]}
                  fontFamily={values[`${name}Font`]}
                  fontSize={values[`${name}FontSize`]}
                  fontStyle={values[`${name}FontStyle`]}
                  fontColor={values[`${name}FontColor`]}>
                  AaBbYyZz
                </Example>
              </ColumnContent>
            </Border>
          </ViewerContent>
        </LowerContent>
      </ModalContent>
    </DefaultModal>
  );
};

export default FontModal;
