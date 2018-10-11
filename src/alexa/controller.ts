import 'reflect-metadata'
import { JsonController, Get, Param, HttpCode, Authorized} from 'routing-controllers';
import { printLabels, countLabels } from '../myparcel/controller';
import { executeJob } from '../lib/printer'

@JsonController()
export default class AlexaController {

  @Authorized()
  @Get('/labels/print/:date')
  @HttpCode(200)
    allLabels(
    @Param('date') date: String
    ) {
        return printLabels(date)
        .then(resp => resp)
  }

  @Authorized()
  @Get('/labels/count/:date')
  @HttpCode(200)
    getCountLabelsByDate(
      @Param('date') date: String
  ) {
    return countLabels(date)
    .then(resp => resp)
  }

  @Authorized()
  @Get('/printer/stop')
  @HttpCode(200)
  async stopPrinter(){
    return await executeJob('Hold-New-Jobs', null)
      .then(hold => executeJob('Pause-Printer-After-Current-Job', null)
      .then(pause => {data: "I've canceled all the jobs"}))
      .catch(err => err)
  }
}