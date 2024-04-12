export interface ILogData {
  context?: string;
  app?: string; // Application or Microservice name
  sourceClass?: string; // Class name of the source
  correlationId?: string; // Correlation ID
  error?: Error; // Error object
  props?: Record<string, any>; // Additional custom properties
  metaData?: Record<string, any>; // Additional meta data
}
