import { Entry } from './Entry'; 

export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
  EntryDetail: { entry: Entry }; 
};