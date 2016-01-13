class CreateEvaluationTypes < ActiveRecord::Migration
  def change
    create_table :evaluation_types do |t|
      t.string :name, limit: 30
      t.string :description

      t.timestamps
    end
  end
end
