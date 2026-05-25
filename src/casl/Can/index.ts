import { createCanBoundTo } from '@casl/react';
import defineAbilityFor from '../index';

const ability = defineAbilityFor();

export const Can = createCanBoundTo(ability);
