import { Ability } from '@casl/ability';

export default function defineAbilityFor() {
  return new Ability([{ action: 'a', subject: 'b' }]);
}
