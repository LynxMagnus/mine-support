@Library('defra-library@feature/PSD-652-node-js-pipeline')
import uk.gov.defra.ffc.DefraUtils

node {
  checkout scm
  build.setGithubStatusPending()
  pipeline.test()
  build.setGithubStatusSuccess()
}
