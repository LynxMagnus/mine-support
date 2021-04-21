import Page from './page'

class PropertyType extends Page {
  /**
  * define elements
  */
  get startNewClaim () { return $('//button[contains(., "Start new claim")]') }
  get saveAndContinueButton () { return $('//button[contains(., "Save and continue")]') }
  get propertyStillAccessible () { return $('//h1[contains(., "Is the property still accessible?")]') }
  get homeRadioButton () { return $('//input') }
  get businessRadioButton () { return $('//*[(@id = "propertyType-2")]') }
  /**
  * define or overwrite page methods
  */
  open () {
    super.open('claim/property-type')
    browser.pause(3000)
  }
  async selectHomeRadioBtn () {
    await (await this.homeRadioButton).click()
  }
  //  page specific methods
  waitForloginPageToLoad () {
    if (!this.homeRadioButton.isDisplayed()) {
      this.homeRadioButton.waitForDisplayed(10000)
    }
  }
}
export default new PropertyType()
