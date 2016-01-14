require 'test_helper'

class DirectoryTest < ActiveSupport::TestCase
  test 'attributes' do
    directory = directories(:dblab_2015_2016_spring_directory)
    assert_respond_to directory, :description
    assert_respond_to directory, :relative_path

    # computed attributes/properties
    assert_respond_to directory, :absolute_path
  end

  test 'associations' do
    directory = directories(:dblab_2015_2016_spring_directory)
    assert_respond_to directory, :semester
  end
end
