import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchFields', async: false })
export class MatchFieldsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedFieldName] = args.constraints;
    const relatedValue = (args.object as any)[relatedFieldName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedFieldName] = args.constraints;
    return `${relatedFieldName} and ${args.property} do not match`;
  }
}
