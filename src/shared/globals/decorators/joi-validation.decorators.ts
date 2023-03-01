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

/**
 * This code is implementing a decorator function called joiValidation, which is used to validate the request body of an HTTP endpoint using the Joi library.

Here is how it works:

The joiValidation function takes an argument schema, which is an instance of a Joi ObjectSchema.
The joiValidation function returns another function of type IJoiDecorator. This returned function is a decorator that will be used to decorate a method in a class.
The decorator function takes three arguments: target, key, and descriptor. These arguments are used by TypeScript to provide information about the decorated method.
The originalMethod variable is used to store a reference to the original method that will be decorated.
The decorator function then replaces the original method with a new function that performs the validation using the schema passed to the joiValidation function.
The new function takes the arguments of the original method, which in this case are req, res, and next.
The function then extracts the req object and validates its body property using the schema.validate method.
If there is an error in validation, the function returns a new instance of a custom error class called JoiRequestValidationError, passing in the error message as a parameter.
If there is no error, the function invokes the original method using originalMethod.apply(this, args), where this is the context of the class instance and args are the arguments passed to the function.
Overall, this decorator function is used to add validation to HTTP endpoints by decorating methods that handle requests. If the request body fails validation, it will return an error. Otherwise, it will proceed with the original method.
 */
