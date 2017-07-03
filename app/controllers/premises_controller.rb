class PremisesController < ApplicationController
  before_action :set_premise, only: [:show, :edit, :update, :destroy]

  # GET /premises
  # GET /premises.json
  def index
    @premises = Premise.includes(:argument).all
  end

  # GET /premises/1
  # GET /premises/1.json
  def show
  end

  # GET /premises/new
  def new
    @premise = Premise.new
  end

  # GET /premises/1/edit
  def edit
  end

  # POST /premises
  # POST /premises.json
  def create
    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @premise = Premise.new(premise_params)
          @premise.save!
          @premise.source_ids = source_ids[:source_ids]
          @premise.supporting_premise_ids = supporting_premise_ids[:supporting_premise_ids]
          format.html {redirect_to @premise, notice: 'Premise was successfully created.'}
          format.json {render :show, status: :created, location: @premise}
        end
      rescue ActiveRecord::RecordInvalid
        format.html {render :new}
        format.json {render json: @premise.errors, status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /premises/1
  # PATCH/PUT /premises/1.json
  def update
    respond_to do |format|
      begin
        ActiveRecord::Base.transaction do
          @premise.update(premise_params)
          @premise.source_ids=source_ids[:source_ids]
          @premise.supporting_premise_ids = supporting_premise_ids[:supporting_premise_ids]
          format.html {redirect_to @premise, notice: 'Premise was successfully updated.'}
          format.json { render json: @premise.argument.get_tree}
        end
      rescue ActiveRecord::RecordInvalid
        format.html {render :edit}
        format.json {render json: @premise.errors, status: :unprocessable_entity}
      end
    end
  end

  # DELETE /premises/1
  # DELETE /premises/1.json
  def destroy
    @premise.destroy
    respond_to do |format|
      format.html {redirect_to premises_url, notice: 'Premise was successfully destroyed.'}
      format.json {head :no_content}
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_premise
    @premise = Premise.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def premise_params
    params.require(:premise).permit(:name, :argument_id)
  end

  def source_ids
    params.permit(:source_ids => [])
  end

  def supporting_premise_ids
    params.permit(:supporting_premise_ids => [])
  end

end
