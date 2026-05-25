import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Tooltip from '@/components/DefaultTooltip';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import { ApplicationState } from '@store/index';
import {
  FaFile,
  FaFolderOpen,
  FaSave,
  FaTrashAlt,
  FaPrint,
  FaUndo,
  FaCalculator,
  FaFileExport,
  FaFileImport,
} from 'react-icons/fa';

import { alertMessages } from '@/hooks/alertMessages';
import { useToolbar } from '@/hooks/toolbar';
import { ButtonAction, Container } from './styles';
import { MdCleaningServices, MdTableView } from 'react-icons/md';
import DashboardToolbar from './DashboardToolbar';
import { useNomenclatures } from '@/hooks/nomenclatures';
import { pathEnum } from '@/enums/pathEnum';

const CalculationsToolbar = () => {
  const toolbar = useToolbar();
  const alertMessage = alertMessages();

  const { ability } = useSelector((state: ApplicationState) => state.auth);
  const { accountId } = useParams() as { accountId: string };
  const [importExportVisible, setImportExportVisible] = useState(false);
  const { nomenclatures } = useNomenclatures();

  const _print = async () => {
    try {
      toolbar.print && toolbar.print();
    } catch (error) {
      alertMessage.error(error.message || '');
    }
  };

  const handleSaveAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toolbar.save && toolbar.save();
  };
  const handlePrintAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    _print();
  };
  const handleViewAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toolbar.view && toolbar.view(nomenclatures);
  };
  const handleCalcAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toolbar.calculator && toolbar.calculator(nomenclatures);
  };
  const handleDeleteAccount = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    toolbar.delete && toolbar.delete();
  };
  const handleOpenAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.open && toolbar.open();
    },
    [toolbar]
  );
  const handleNewAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.new && toolbar.new();
    },
    [toolbar]
  );

  const handleImportAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.importCalc && toolbar.importCalc();
    },
    [toolbar]
  );
  const handleExportAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.exportCalc && toolbar.exportCalc();
    },
    [toolbar]
  );
  const handleReloadAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.reload && toolbar.reload();
    },
    [toolbar]
  );

  const handleUndoAccount = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      toolbar.undo && toolbar.undo();
    },
    [toolbar]
  );

  useEffect(() => {
    const shouldImportExportCalc = ability.rules.find(
      (rule: any) => rule.subject === 'Import&Export' && rule.action === 'view'
    );
    setImportExportVisible(!!shouldImportExportCalc);
  }, []);
  return (
    <Fragment>
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.new} type="button" onClick={handleNewAccount}>
          <Tooltip withoutHoverColor={true} text="Novo cálculo(CTRL+F1)">
            <FaFile />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {importExportVisible ? (
        <Fragment>
          {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
            <ButtonAction disabled={!toolbar.visibleButtons.import} type="button" onClick={handleImportAccount}>
              <Tooltip withoutHoverColor={true} text="Importar Cálculo">
                <FaFileExport />
              </Tooltip>
            </ButtonAction>
          ) : (
            <Fragment />
          )}
          {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
            <ButtonAction disabled={!toolbar.visibleButtons.export} type="button" onClick={handleExportAccount}>
              <Tooltip withoutHoverColor={true} text="Exportar Cálculo">
                <FaFileImport />
              </Tooltip>
            </ButtonAction>
          ) : (
            <Fragment />
          )}
        </Fragment>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.open} type="button" onClick={handleOpenAccount}>
          <Tooltip withoutHoverColor={true} text="Abrir cálculo">
            <FaFolderOpen />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(ability.can('save', 'Account') || accountId) && (toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) && (
        <ButtonAction disabled={!toolbar.visibleButtons.save} type="button" onClick={handleSaveAccount}>
          <Tooltip withoutHoverColor={true} text="Salvar(CTRL+F12)">
            {<FaSave />}
          </Tooltip>
        </ButtonAction>
      )}
      {toolbar.visibleButtons.reload ? (
        <ButtonAction disabled={!toolbar.visibleButtons.reload} type="button" onClick={handleReloadAccount}>
          <Tooltip
            withoutHoverColor={true}
            text={toolbar.type?.includes(pathEnum.NOMENCLATURE) ? 'Restaurar Padrão' : 'Recarregar'}>
            <FaUndo />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.undo} type="button" onClick={handleUndoAccount}>
          <Tooltip withoutHoverColor={true} text="Limpar cálculo">
            <MdCleaningServices />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.delete} type="button" onClick={handleDeleteAccount}>
          <Tooltip withoutHoverColor={true} text="Deletar(CTRL+F11)">
            <FaTrashAlt />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.print} type="button" onClick={handlePrintAccount}>
          <Tooltip withoutHoverColor={true} text="Imprimir(CTRL+F10)">
            <FaPrint />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.calculator} type="button" onClick={handleCalcAccount}>
          <Tooltip withoutHoverColor={true} text="Calcular cálculo">
            <FaCalculator />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
      {(toolbar.type?.includes(pathEnum.CURRENT_ACCOUNT) || toolbar.type?.includes(pathEnum.SIMPLE_UPDATE)) ? (
        <ButtonAction disabled={!toolbar.visibleButtons.calculator} type="button" onClick={handleViewAccount}>
          <Tooltip withoutHoverColor={true} text="Visualizar cálculo">
            <MdTableView />
          </Tooltip>
        </ButtonAction>
      ) : (
        <Fragment />
      )}
    </Fragment>
  );
};

const ToolBar = (): JSX.Element => {
  const toolbar = useToolbar();
  const [dashboard, setDashboard] = useState(false);

  useEffect(() => {
    if (location.pathname != '/')
      return () => {
        setDashboard(false);
      };

    setDashboard(true);

    return () => {
      setDashboard(false);
    };
  }, []);

  return (
    <Container $visibility={toolbar.visible}>{!dashboard ? <CalculationsToolbar /> : <DashboardToolbar />}</Container>
  );
};

export default ToolBar;
