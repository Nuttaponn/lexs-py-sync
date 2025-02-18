export interface ILinkTooltip {
  name?: string;
  url?: string;
  icon?: string;
}

export interface ITooltip {
  header?: string;
  title?: string;
  content?: string;
  link?: ILinkTooltip;
  contentClasses?: string;
}
