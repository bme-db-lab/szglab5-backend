require 'test_helper'

class MessageTest < ActiveSupport::TestCase
  test 'attributes' do
    message = messages(:uploadsuccessful_en)
    assert_respond_to message, :code
    assert_respond_to message, :message_text
  end

  test 'associations' do
    message = messages(:uploadsuccessful_en)
    assert_respond_to message, :client
    assert_respond_to message, :language
  end
end