import type { Options } from 'tsup'

export const tsup: Options = {
  entry: ['*.ts', 'core/**/*.ts', 'busi/**/*.ts', 'sys/**/*.ts'],
  format: ['esm'],
  // dts: true,
  // splitting: true,
  clean: true
}
