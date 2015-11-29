require 'test_helper'

class FixturesTest < ActiveSupport::TestCase
  #
  # This test should load data for an example semester.
  #
  test 'loading fixtures' do
    course = courses(:dblab)
    semester = semesters(:dblab_2015_2016_spring)

    # assertions
    assert_equal course, semester.course, 'example semester is not related to course'
  end
end
