import Page from './page'

class PropertyAccessible extends Page {
  /**
  * define elements
  */

  get serviceName () { return $('//.govuk-header__link--service-name') }
  get headingQuestion () { return $('//.govuk-fieldset__heading') }
  get questionHint () { return $('//#accessible-hint') }
  get yesRadioButton () { return $('//*[(@id = "accessible")]') }
  get noRadioButton () { return $('//*[(@id = "accessible-2")]') }
  get saveAndContinueButton () { return $('.govuk-button') }
  /**
     * define or overwrite page methods
     */
  open () {
    super.open('')
    browser.pause(3000)
  }
  /**
     * your page specific methods
     */
}
export default new PropertyAccessible()
