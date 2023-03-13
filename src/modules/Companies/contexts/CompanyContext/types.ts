export type ContextProps = {
  company: CVT.Maybe<Companies.Company>;
  selectCompany: (company: CVT.MaybeNull<Companies.Company>) => void;
};
