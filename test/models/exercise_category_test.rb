require 'test_helper'

class ExerciseCategoryTest < ActiveSupport::TestCase
  test 'attributes' do
    exercise_category = exercise_categories(:dblab_dbms)
    assert_respond_to exercise_category, :name
    assert_respond_to exercise_category, :short_name
  end

  test 'associations' do
    exercise_category = exercise_categories(:dblab_dbms)
    assert_respond_to exercise_category, :course
  end
end
