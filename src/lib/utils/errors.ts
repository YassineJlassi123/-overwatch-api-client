import { ZodIssue } from 'zod';

export class OverwatchApiError extends Error {
  public statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'OverwatchApiError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public issues: ZodIssue[];

  constructor(message: string, issues: ZodIssue[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}