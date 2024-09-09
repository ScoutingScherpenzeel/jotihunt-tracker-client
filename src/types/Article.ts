export interface Article {
  id: number;
  title: string;
  type: string;
  publishAt: Date;
  content: string;
  messageType: string;
  maxPoints: number;
  endTime: Date;
}
