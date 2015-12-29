require 'test_helper'

class LanguageTest < ActiveSupport::TestCase
  test 'attributes' do
    language = languages(:hun)
    assert_respond_to language, :code
    assert_respond_to language, :name
  end
end
