@Library('defra-library@feature/PSD-652-node-js-pipeline')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

node {
  checkout scm
  build.setGithubStatusPending()
  build.setGithubStatusSuccess()
}
