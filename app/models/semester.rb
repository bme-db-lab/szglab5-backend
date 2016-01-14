# TODO: documentation
#
# academic_year: 2015 for 2015/2016
# academic_term: 1 == fall, 2 == spring
class Semester < ActiveRecord::Base
  belongs_to :course
  has_many :students, inverse_of: :semester
  has_many :staffs, inverse_of: :semester
  has_many :directories, inverse_of: :semester

  def display_year
    %(#{academic_year}/#{academic_year + 1})
  end
end
