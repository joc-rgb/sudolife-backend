import { JoiRequestValidationError } from '@global/helpers/error-handler';
import { ObjectSchema } from 'joi';

//type method return void
type IJoiDecorator = (target: any, key: string, descriptor: PropertyDescriptor) => void;

export function joiValidation(schema: ObjectSchema): IJoiDecorator {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    //Perform Validation
    //...args = req,res,next
    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      // validateAsync or validate
      const { error } = await Promise.resolve(schema.validate(req.body));
      if (error?.details) {
        return new JoiRequestValidationError(error.details[0].message);
      }
      // invoke original method and get its return value
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
