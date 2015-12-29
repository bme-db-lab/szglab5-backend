require 'test_helper'

class ExerciseTypeTest < ActiveSupport::TestCase
  test 'attributes' do
    exercise_type = exercise_types(:dblab_dbms_video)
    assert_respond_to exercise_type, :name
    assert_respond_to exercise_type, :short_name
    assert_respond_to exercise_type, :exercise_number

    # computed attributes/properties
    assert_respond_to exercise_type, :display_codename
    assert_equal '33-VIDEO', exercise_type.display_codename
  end

  test 'associations' do
    exercise_type = exercise_types(:dblab_dbms_video)
    assert_respond_to exercise_type, :exercise_category
    assert_respond_to exercise_type, :language
  end
end
