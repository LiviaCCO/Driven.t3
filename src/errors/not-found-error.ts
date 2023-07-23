import { ApplicationError } from '@/protocols';

export function notFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
}

export function badRequestError(): ApplicationError {
  return {
    name: 'Bad request',
    message: 'xxxxxxx!',
  };
}

export function paymentRequiredError(): ApplicationError {
  return {
    name: 'Payment Required',
    message: 'xxxxxxx!',
  };
}