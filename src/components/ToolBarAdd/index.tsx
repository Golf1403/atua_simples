import React from 'react';
import Tooltip from '../DefaultTooltip';

import { FaPlus } from 'react-icons/fa';

interface IProps {
  onAdd: Function;
}

const ToolBarAdd = ({ onAdd }: IProps): JSX.Element => {
  return (
    <div>
      <div style={{ marginLeft: '5px' }}>
        <div
          className={`btn toolbar-button btn-outline-square-icon ${typeof onAdd !== 'function' ? 'disabled' : ''}`}
          onClick={() => onAdd(true)}>
          <Tooltip withoutHoverColor={true} text={`Adicionar`}>
            <FaPlus />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ToolBarAdd;
