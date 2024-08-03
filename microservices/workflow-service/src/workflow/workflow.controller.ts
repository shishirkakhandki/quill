import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { Response } from 'express';

@Controller()
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('/exploit-detected')
  async handleExploitDetection(
    @Body()
    body: {
      address: string;
      amount: number;
      transactionHash: string;
      blockNumber: number;
      gasUsed: number;
      contractAddress: string;
      exploitType: string;
      status: string;
    },
    @Res() res: Response,
  ) {
    const {
      address,
      amount,
      transactionHash,
      blockNumber,
      gasUsed,
      contractAddress,
      exploitType,
      status,
    } = body;

    if (
      !address ||
      !amount ||
      !transactionHash ||
      !blockNumber ||
      !gasUsed ||
      !contractAddress ||
      !exploitType ||
      !status
    ) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Missing required fields in request body');
    }

    try {
      await this.workflowService.addJobsToQueues({
        address,
        amount,
        transactionHash,
        blockNumber,
        gasUsed,
        contractAddress,
        exploitType,
        status,
      });
      res.send('Exploit detected and jobs added to queues');
    } catch (error) {
      console.error('Error in adding jobs to queues:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to add jobs to queues');
    }
  }
}
