function ViewModel (name, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    label: {
      text: 'Full name'
    },
    classes: 'govuk-input--width-20',
    id: 'name',
    name: 'name',
    type: 'text'
  }

  if (name != null) {
    this.model.value = name
  }

  // If error is passed to model then this error property is added to the model and therefore radio macro
  if (error) {
    this.model.errorMessage = {
      text: 'Please enter your name'
    }
  }
}

module.exports = ViewModel
