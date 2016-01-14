# TODO: documentation
#
class Directory < ActiveRecord::Base
  belongs_to :semester

  def absolute_path
    # TODO: get base path from configuration
    path
  end
end
