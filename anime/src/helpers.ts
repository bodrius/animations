import {Routes} from './routes';

export const getTabIcon = (tabName: string) => {
  if (Routes.CREATE_POST_STACK === tabName) {
    return 'add-circle-outline';
  } else if (Routes.DASHBOARD_STACK == tabName) {
    return 'home-outline';
  } else {
    return 'chatbubble-ellipses-outline';
  }
};
