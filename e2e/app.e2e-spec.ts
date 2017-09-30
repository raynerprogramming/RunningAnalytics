import { RunningAnalyticsPage } from './app.po';

describe('running-analytics App', () => {
  let page: RunningAnalyticsPage;

  beforeEach(() => {
    page = new RunningAnalyticsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
