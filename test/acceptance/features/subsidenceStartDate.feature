Feature: Date of Subsidence Page checks

    Scenario: Enter a date for the start of subsidence

        Given I open the url "/claim/date-of-subsidence"
        Then I expect that the url contains "/claim/date-of-subsidence"
        Then I expect that the title contains "FFC Demo Service - GOV.UK"
        Given I clear the inputfield "#date-of-subsidence-day"
        And I add "01" to the inputfield "#date-of-subsidence-day"
        And I clear the inputfield "#date-of-subsidence-month"
        And I add "01" to the inputfield "#date-of-subsidence-month"
        And I clear the inputfield "#date-of-subsidence-year"
        And I add "1970" to the inputfield "#date-of-subsidence-year"
        And I click on the button ".govuk-button"
        Then I expect that the url contains "/claim/mine-type"
