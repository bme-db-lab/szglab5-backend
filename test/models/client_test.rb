require 'test_helper'

class ClientTest < ActiveSupport::TestCase
  test 'attributes' do
    client = clients(:swl5admin)
    assert_respond_to client, :code
    assert_respond_to client, :name
  end

  test 'associations' do
    client = clients(:swl5admin)
    assert_respond_to client, :extended_client
    assert_respond_to client, :course
    assert_respond_to client, :default_language
  end
end
