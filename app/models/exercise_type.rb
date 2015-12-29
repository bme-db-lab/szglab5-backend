# TODO: documentation
#
class ExerciseType < ActiveRecord::Base
  belongs_to :language
  belongs_to :exercise_category

  def display_codename
    %(#{exercise_number}-#{short_name.upcase})
  end
end
