import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';

// Screens
type SignedOutStackParamList = {
  Signin: undefined,
}

type SignedInDrawerParamList = {
  Dashboard: undefined,
  News: undefined,
  Vacation: undefined,
  Account: undefined,
};

type VacationStackParamList = {
  VacationMain: undefined,
  VacationForm: undefined,
}

type SigninScreenNavigationProp = StackNavigationProp<SignedOutStackParamList, 'Signin'>;
type SigninScreenProps = { navigation: SigninScreenProps };

type AccountScreenNavigationProp = DrawerNavigationProp<SignedInDrawerParamList, 'Account'>;
type AccountScreenProps = { navigation: AccountScreenNavigationProp };

type DashboardScreenNavigationProp = DrawerNavigationProp<SignedInDrawerParamList, 'Dashboard'>;
type DashboardScreenProps = { navigation: DashboardScreenNavigationProp };

type NewsScreenNavigationProp = DrawerNavigationProp<SignedInDrawerParamList, 'News'>;
type NewsScreenProps = { navigation: NewsScreenNavigationProp };

type VacationScreenNavigationProp = DrawerNavigationProp<SignedInDrawerParamList, 'Vacation'>;
type VacationScreenProps = { navigation: VacationScreenNavigationProp };

type VacationMainScreenNavigationProp = StackNavigationProp<VacationStackParamList, 'VacationMain'>;
type VacationMainScreenProps = { navigation: VacationMainScreenNavigationProp };

type VacationFormScreenNavigationProp = StackNavigationProp<VacationStackParamList, 'VacationForm'>;
type VacationFormScreenProps = { navigation: VacationFormScreenNavigationProp };

export { 
  SignedOutStackParamList,
  SignedInDrawerParamList,
  SigninScreenProps,
  VacationStackParamList,
  AccountScreenProps,
  DashboardScreenProps,
  NewsScreenProps,
  VacationScreenProps,
  VacationMainScreenProps,
  VacationFormScreenProps,
};