Feature: Create and submit a new claim

    Scenario: Successfully complete form to submit a new claim

        Given I open the url "/"
        Then I expect that the title contains "FFC Demo Service - GOV.UK"
        Then I expect that element "h1" contains the text "FFC Demo Service"
        When I click on the button ".govuk-button--start"
        Then I expect that the url contains "/claim/property-type"

        When I click on the button "#propertyType"
        When I click on the button ".govuk-button"
        Then I expect that the url contains "/claim/accessible"

        When I click on the button "#accessible"
        When I click on the button ".govuk-button"
        Then I expect that the url contains "/claim/date-of-subsidence"

        And I clear the inputfield "#date-of-subsidence-day"
        And I add "01" to the inputfield "#date-of-subsidence-day"
        And I clear the inputfield "#date-of-subsidence-month"
        And I add "01" to the inputfield "#date-of-subsidence-month"
        And I clear the inputfield "#date-of-subsidence-year"
        And I add "1970" to the inputfield "#date-of-subsidence-year"
        And I click on the button ".govuk-button"
        Then  I expect that the url contains "/claim/mine-type"

        When I click on the button "#mineType-3"
        When I click on the button ".govuk-button"
        And I clear the inputfield "#email"
        And I add "seymour.pattisson@defra.gov.uk" to the inputfield "#email"
        When I click on the button ".govuk-button"
        Then I expect that the url contains "/claim/confirmation"