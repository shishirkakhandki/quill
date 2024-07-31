import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Response } from 'express';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('/exploit-detected')
  async handleExploitDetection(
    @Body() body: { address: string; amount: number },
    @Res() res: Response,
  ) {
    const { address, amount } = body;
    if (!address || !amount) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing address or amount in request body');
    }

    try {
      await this.workflowService.addJobsToQueues({ address, amount });
      res.send('Exploit detected and jobs added to queues');
    } catch (error) {
      console.error('Error in adding jobs to queues:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to add jobs to queues');
    }
  }
}
