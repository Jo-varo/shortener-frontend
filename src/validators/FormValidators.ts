import { Validators } from "@angular/forms";
import { URL_REGEX } from "../helpers/constants";

export const originalUrlValidators = [
  Validators.required,
  Validators.maxLength(500),
  Validators.pattern(URL_REGEX),
]