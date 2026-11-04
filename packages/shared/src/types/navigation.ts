export interface NavItem {
  href: string;
  label: string;
}

export interface NavLinkDefinition<TLabelKey extends string = string> {
  href: string;
  labelKey: TLabelKey;
}
