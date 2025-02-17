export type screenProps = {
  _id?: string;
  screenId: string;
  name: string;
  content?: string;
};
export type deviceProps = {
  id: string;
  screenId: string;
  status: string;
};
export type navigationProps = {
  name: string;
  href: string;
};
export type ErrorsProps = {
  key: string;
  message: string;
};
