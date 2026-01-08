export interface IHashingService {
  hash(data: string): Promise<string>;

  compare(data: string, encrypted: string): Promise<boolean>;
}
