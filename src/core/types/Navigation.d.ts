declare namespace CVT {
  export namespace Navigation {
    export type NavigationItem = {
      icon?: React.ReactElement;
      text?: string;
      secondaryText?: string;
      requiresAuth?: boolean;
      route?: string;
      onClick?: () => void;
      divider?: boolean;
      children?: NavigationItem[];
    }

    export type Config = {
      header?: NavigationItem[];
      sidebar?: NavigationItem[];
      userMenu?: NavigationItem[];
    };
  }
};
