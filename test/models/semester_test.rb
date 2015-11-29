require 'test_helper'

class SemesterTest < ActiveSupport::TestCase
  test 'attributes' do
    semester = semesters(:dblab_2015_2016_spring)
    assert_respond_to semester, :academic_year
    assert_respond_to semester, :academic_term

    # computed attributes/properties
    assert_respond_to semester, :display_year
    assert_equal '2015/2016', semester.display_year
  end

  test 'associations' do
    semester = semesters(:dblab_2015_2016_spring)
    assert_respond_to semester, :course
  end
end
