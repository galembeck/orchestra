export interface NavItem {
  href: string;
  label: string;
}

export interface NavLinkDefinition<TLabelKey extends string = string> {
  href: string;
  labelKey: TLabelKey;
}

export interface NavGroup {
  links: readonly NavItem[];
  title: string;
}

export interface NavGroupDefinition<
  TTitleKey extends string = string,
  TLabelKey extends string = string,
> {
  links: readonly NavLinkDefinition<TLabelKey>[];
  titleKey: TTitleKey;
}
