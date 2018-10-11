import * as ipp from 'ipp';
import * as fs from 'mz/fs';

import {PRINTER_IPP} from './common'

export async function executeJob(job, message){
  let printer = ipp.Printer(PRINTER_IPP)

  return await new Promise((resolve) => {
    printer.execute(job, message, (_, response) => {
      resolve(response)
    })
  })
}

async function print(buffer, mime, name = 'Print job' ){
  return await executeJob('Print-Job', {
    'operation-attributes-tag': {
      'job-name': name,
      'document-format': mime
    },
    data: buffer
  })
}

export const printPDFFile = async (filename) => await print(await fs.readFile(filename), 'application/pdf', filename)
export const printPDFBuffer = async (buffer, name = 'Print job') => await print(buffer, 'application/pdf', name)