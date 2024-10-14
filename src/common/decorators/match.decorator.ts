import { ValidationOptions, registerDecorator } from 'class-validator';
import { MatchFieldsConstraint } from './match-fields.constraint';

export function Match(relatedFieldName: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'MatchFields',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [relatedFieldName],
      validator: MatchFieldsConstraint,
    });
  };
}
