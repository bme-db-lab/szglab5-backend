class CreateStaffs < ActiveRecord::Migration
  def change
    create_table :staffs do |t|
      t.references :semester, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
