require 'test_helper'

class FixturesTest < ActiveSupport::TestCase
  #
  # This test should load data for an example semester.
  #
  test 'loading fixtures' do
    language = languages(:hun)
    course = courses(:dblab)

    semester = semesters(:dblab_2015_2016_spring)
    exercise_category = exercise_categories(:dblab_dbms)
    exercise_type = exercise_types(:dblab_dbms_video)

    # assertions
    assert_equal course, semester.course, 'example semester is not related to course'
    assert_equal course, exercise_category.course, 'example excercise category is not related to course'
    assert_equal exercise_category, exercise_type.exercise_category, 'example exercise type is not related to the category'
    assert_equal language, exercise_type.language, 'example exercise type has no or incorrect language defined'
  end
end
